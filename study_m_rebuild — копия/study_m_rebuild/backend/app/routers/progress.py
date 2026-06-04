from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.data.theory import THEORY_SECTIONS
from app.db.session import get_db
from app.dependencies import get_current_user
from app.models import User, UserProgress
from app.schemas import ProgressRead

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/me")
def get_my_progress(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    records = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).all()
    completed = {record.section_id for record in records if record.is_completed}
    total = len(THEORY_SECTIONS)
    percent = round((len(completed) / total) * 100) if total else 0
    return {
        "user_id": current_user.id,
        "total_sections": total,
        "completed_sections": len(completed),
        "percent": percent,
        "records": records,
    }


@router.get("/{user_id}", response_model=list[ProgressRead])
def get_progress(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    role = current_user.role.name
    if role == "student" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Студент может смотреть только свой прогресс")
    return db.query(UserProgress).filter(UserProgress.user_id == user_id).order_by(UserProgress.section_id).all()
