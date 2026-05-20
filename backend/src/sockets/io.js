let ioInstance;

export function setSocketServer(io) {
  ioInstance = io;
}

export function getSocketServer() {
  return ioInstance;
}

export function emitToProject(projectId, event, payload) {
  if (ioInstance) ioInstance.to(`project:${projectId}`).emit(event, payload);
}

export function emitToUser(userId, event, payload) {
  if (ioInstance) ioInstance.to(`user:${userId}`).emit(event, payload);
}
