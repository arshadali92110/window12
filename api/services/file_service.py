from api.repositories.file_repo import file_repo
from api.routers.websocket import broadcast_file_change
from typing import List, Dict, Optional

class FileService:
    async def get_all_files(self, user_id: str) -> List[Dict]:
        return file_repo.get_all(user_id)

    async def get_file(self, user_id: str, file_id: str) -> Optional[Dict]:
        return file_repo.get_by_id(user_id, file_id)

    async def create_file(self, user_id: str, file_data: Dict) -> Dict:
        created = file_repo.create(user_id, file_data)
        await broadcast_file_change(user_id, "created", created)
        return created

    async def update_file(self, user_id: str, file_id: str, updates: Dict) -> Optional[Dict]:
        updated = file_repo.update(user_id, file_id, updates)
        if updated:
            updated_full = file_repo.get_by_id(user_id, file_id)
            if updated_full:
                await broadcast_file_change(user_id, "updated", updated_full)
        return updated

    async def delete_file(self, user_id: str, file_id: str) -> bool:
        success = file_repo.delete(user_id, file_id)
        if success:
            await broadcast_file_change(user_id, "deleted", {"id": file_id})
        return success

    async def copy_file(self, user_id: str, file_id: str) -> Optional[Dict]:
        original = file_repo.get_by_id(user_id, file_id)
        if not original:
            return None
        new_file = {
            "name": original["name"] + " - Copy",
            "type": original["type"],
            "parent_id": original.get("parent_id", "root"),
            "content": original.get("content", "")
        }
        created = file_repo.create(user_id, new_file)
        await broadcast_file_change(user_id, "created", created)
        return created

file_service = FileService()