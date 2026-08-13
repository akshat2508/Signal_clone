import asyncio
import websockets

async def test_ws():
    try:
        async with websockets.connect(
            "ws://localhost:8000/ws/conversations",
            extra_headers={"Origin": "http://localhost:3000"}
        ) as websocket:
            print("Connected!")
    except Exception as e:
        print(f"Failed: {e}")

asyncio.run(test_ws())
