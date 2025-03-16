// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  type: "service_account",
  project_id: "mesayaatech1",
  private_key_id: "d1aded6c553e3873d6506d412db589a536d4f8aa",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC5gwIss+ayN/W7\nkzmtedWNQewAtzla6gbOs4hLQc0VfLJe4F54MVFZ6SN/wNfHLTjWgtyF0A78whRC\nlA2TdS61qAwDKivv+BE0DzTcSfcjCUCKqZe+81Wyc3ptv+YHZGpbArF6+kf5w0OO\ns9PdJANi93KikZCrYebJTqqB/O51NH3ytQftGpBybgtvgqZwKTnIGH2nKhCTu4WJ\nq4x9xSdOlNpxf5oRiuZ9EXvbEa67Keq+QfLVx1tH5WfHglE24nI92Lw2fQqOAPj8\niZtkfxSiVpUjptuobVcIb8LuKVQ9e/WG+UvIen1InR3Q8kJBLef8yW6lqsLnwEFt\nOCMJ6LQ5AgMBAAECggEAAeDz0STUb7vdboQV+T3S1d/uk6PHY4uw8bUzqp0cxkx5\niHiHJbphzOetkxDD2/8nNGnwcTT7aop4ds5QdGIN4kD/TSVnUEJKgfornSsCbcMI\nBFd7GKVBegxiwiYyPniBKLvhCleASi/fbmb/vL1i1jo0DvWAhJx6ADzTwSZWT7l0\nfJ2dZRTqtuX73ewhCt5CIIP1xTXUDaNFjDRUa+YbQxdMUU/0+V2bpOkG7qomEa+c\nIHdx7OwaBbj01BzwQOGZznHU1fxC0Imrtb0W6v87KAlXKFovYDjDmiSc7kfexTQG\n6jIF7udXznp8G0kMgdrk639VGzVP8f+1s8l1Q49S4QKBgQDnNHkuBD+W2lktj6hz\n7rpapw9SaI7ZCYf61V2vEEKA+EU03PZoJoGpwjgZZ16xckcH12vJDj8lJcdFigA4\nuP1227nghvQYjP53X2hwWXx1H/C3Vx15VYrr3RAsM7qk3NMFQjel4g79FOnu6qDJ\ndKmGOFIu9Hf7cDMjr64XTcYSWQKBgQDNaBGD6qGt0yXAc62IV/MTeu/0jW4htkWp\nuy6GidVSpFSJG4JqOFbwMPSbF/sn58M3upCFBO4b4FR3ndEnXOyTWikJHA8vkgbl\nCKTHsFvXD6Zh1LKAwCXG9Nc+UA1/iX60r9C4tzVW97CUOLhgS4jbLgmR/md7aPaD\nvw1ow8y04QKBgFsXvIrZ16f63VnrGOacb0XaPlosoeN3MuEsAZ5A3MLtjm7WhCri\nyQF2aR3xMUjeiofXYzsy5sQfD1Uhmxa+I/cZeTGyWif2HSgxKffh+fw3mmLR6uXs\nQzDMx1tzAh2Ed4vB3CT6XQdvnv+n57OXyFb+h7rCTSd+vFdaF1BNLzX5AoGAGcAq\nMfeAPWJzISVfY/BisNaAro/sdp17LkQhGQy+iZXAY0/nkZlujL4WbDsdaWtMtffV\nlld/4k7FSBmo1t53aiGrc1DpNnWAF8Z1ofMiEFwN58Xaevmbws1/DnjKuGpsUAqa\niA2vyi9TG8Hgm3Hcvl2PJZZXMsl93hZdf/zL9QECgYAI8B1gOprOi8AoDzieL/DL\nNz/ai+hjV+jI+VNDLEGafdLsMCOPdO0vVKNoSS5INlpHKgbzkdc4n1ApyzbEvJ7i\n2ODyjwafEWk0mgtj3lnDPt9lp0abDcQoFbTzThg9MJUJFc1mrZw3tqiVKPHb8lBW\nDWjrVJFRsEBXmvaV2PclFQ==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@mesayaatech1.iam.gserviceaccount.com",
  client_id: "115248806354562714640",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mesayaatech1.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
