import logging

from fastapi import  FastAPI, Request, status, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from views.auth import router as auth_router
from views.service import router as service_router
from config import LOG_LEVEL


logging.basicConfig(
    level=LOG_LEVEL,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)


app = FastAPI()
app.include_router(auth_router, prefix="/api/v1", tags=['Auth'])
app.include_router(service_router, prefix="/api/v1", tags=['Service'])

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        field = error["loc"][-1] if error["loc"] else "unknown"
        if error["type"] == "missing":
            message = f"Поле '{field}' обязательно для заполнения"
        elif error["type"] == "value_error":
            message = error["msg"].replace("Value error, ", "")
        else:
            message = error["msg"]

        errors.append({
            "field": field,
            "message": message,
            "type": error["type"]
        })

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content={
            "success": False,
            "code": "VALIDATION_ERROR",
            "message": "Ошибка валидации данных",
            "errors": errors
        }
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if isinstance(exc.detail, dict) and "code" in exc.detail:
        detail = exc.detail
    else:
        detail = {
            "code": "HTTP_ERROR",
            "message": str(exc.detail)
        }

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            **detail
        }
    )


@app.get("/")
async def read_root():
    return {"Hello": "World"}
