"use client";
import React from 'react';

export default function viewJob({ job, onClose }) {
  if (!job) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2>{job.title}</h2>
        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Description:</strong> {job.description}</p>
        <p><strong>Publisher:</strong> {job.publisherName}</p>
      </div>
    </div>
  );
}