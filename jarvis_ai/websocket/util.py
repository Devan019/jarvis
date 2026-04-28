"""WebSocket utilities for FastAPI"""

from fastapi import WebSocket, WebSocketDisconnect
from typing import Set


class ConnectionManager:
    """Manages WebSocket connections"""

    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        """Accept and register a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.add(websocket)

    async def disconnect(self, websocket: WebSocket):
        """Remove a disconnected WebSocket connection"""
        self.active_connections.discard(websocket)

    async def broadcast(self, message: str):
        """Send a message to all connected clients"""
        disconnected = set()
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                disconnected.add(connection)

        # Clean up disconnected clients
        for connection in disconnected:
            await self.disconnect(connection)

    async def send_personal(self, websocket: WebSocket, message: str):
        """Send a message to a specific client"""
        try:
            await websocket.send_text(message)
        except Exception:
            await self.disconnect(websocket)

    def get_active_connections_count(self) -> int:
        """Get the count of active WebSocket connections"""
        return len(self.active_connections)
