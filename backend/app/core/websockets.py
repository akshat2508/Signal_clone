from typing import Dict, List, Any
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # Maps conversation_id to a list of WebSockets
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # Maps user_id to online status (could expand to map user_id to their active websockets)
        self.user_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        
        if user_id not in self.user_connections:
            self.user_connections[user_id] = []
        self.user_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.user_connections:
            if websocket in self.user_connections[user_id]:
                self.user_connections[user_id].remove(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]

    async def broadcast_to_users(self, user_ids: List[str], message: dict):
        for user_id in user_ids:
            if user_id in self.user_connections:
                for connection in self.user_connections[user_id]:
                    try:
                        await connection.send_json(message)
                    except:
                        pass
                
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)

manager = ConnectionManager()
