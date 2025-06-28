'use client';
import { useState, useEffect, useRef } from 'react';
import { PlusCircle } from 'lucide-react';
import './DraggableButton.css';

export default function DraggableButton({ onClick, title }) {
  const defaultTopPercent = 0.25;
  const defaultLeftPercent = 0.75;
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [percentPosition, setPercentPosition] = useState({ topPercent: defaultTopPercent, leftPercent: defaultLeftPercent });
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const clickThreshold = 5;

  useEffect(() => {
    const stored = localStorage.getItem('draggableJobButtonPosition');
    const initial = stored
      ? JSON.parse(stored)
      : { topPercent: defaultTopPercent, leftPercent: defaultLeftPercent };

    const adjustLeft = () => {
      const rightOffset = window.innerWidth > 768 ? 250 : 0;
      return initial.leftPercent * (window.innerWidth - rightOffset);
    };

    setPercentPosition(initial);
    setPosition({
      top: initial.topPercent * window.innerHeight,
      left: adjustLeft()
    });

    const handleResize = () => {
      const rightOffset = window.innerWidth > 768 ? 250 : 0;
      setPosition({
        top: percentPosition.topPercent * window.innerHeight,
        left: percentPosition.leftPercent * (window.innerWidth - rightOffset)
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleDragStart = (e) => {
    e.preventDefault();
    setDragging(true);
    const point = e.touches ? e.touches[0] : e;
    dragStartRef.current = { x: point.clientX, y: point.clientY };
    // console.log(dragStartRef.current);
  };

  const handleDrag = (e) => {
    if (!dragging) return;
    const point = e.touches ? e.touches[0] : e;

    const rightOffset = window.innerWidth > 768 ? 250 : 0;
    const newLeft = Math.min(point.clientX - 25, window.innerWidth - rightOffset - 60); // מוודא שלא ייכנס מתחת לבר
    const newTop = point.clientY - 25;

    const topPercent = newTop / window.innerHeight;
    const leftPercent = newLeft / (window.innerWidth - rightOffset);

    setPosition({ top: newTop, left: newLeft });
    setPercentPosition({ topPercent, leftPercent });
  };

  const handleDragEnd = (e) => {
    setDragging(false);
    localStorage.setItem('draggableJobButtonPosition', JSON.stringify(percentPosition));
  };

  const handleClick = (e) => {
    const point = e.touches ? e.changedTouches[0] : e;
    const dx = point.clientX - dragStartRef.current.x;
    const dy = point.clientY - dragStartRef.current.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    if (distance < clickThreshold && onClick) {
      onClick();
    }
  };

  return (
    <button
      className="DraggableButton"
      title={title}
      style={{
        top: position.top,
        left: position.left
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDrag}
      onTouchEnd={(e) => {
        handleDragEnd(e);
        handleClick(e);
      }}
      onClick={(e) => {
        if (!e.nativeEvent.touches) handleClick(e);
      }}
    >
      <PlusCircle size={30} />
    </button>

  );
}
