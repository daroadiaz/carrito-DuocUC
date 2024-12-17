from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List
from pydantic import BaseModel

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar carpeta de imágenes estáticas
app.mount("/static", StaticFiles(directory="static"), name="static")

# Modelo de datos
class Product(BaseModel):
    id: str
    imagen: str
    titulo: str
    precio: str
    cantidad: int
    descripcion: str

class Purchase(BaseModel):
    nombre: str
    email: str
    direccion: str
    productos: List[Product]

# Datos hardcodeados
products = [
    {
        "id": "1",
        "imagen": "/static/images/curso4.jpg",
        "titulo": "Huerto en casa",
        "precio": "$200",
        "cantidad": 0,
        "descripcion": "Aprende a crear y mantener tu propio huerto urbano",
    },
    {
        "id": "2",
        "imagen": "/static/images/curso5.jpg",
        "titulo": "Decora tu hogar",
        "precio": "$1020",
        "cantidad": 0,
        "descripcion": "Técnicas profesionales de decoración de interiores",
    },
    {
        "id": "3",
        "imagen": "/static/images/curso1.jpg",
        "titulo": "Diseño Web",
        "precio": "$1020",
        "cantidad": 0,
        "descripcion": "Domina las últimas tecnologías web",
    },
]

purchases = []  # Lista para almacenar compras temporalmente

@app.get("/products", response_model=List[Product])
async def get_products():
    return products

@app.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    for product in products:
        if product["id"] == product_id:
            return product
    return {"error": "Product not found"}

@app.post("/purchases")
async def create_purchase(purchase: Purchase):
    purchases.append(purchase.dict())  # Guardar compra temporalmente
    return {"message": "Compra registrada con éxito", "purchase": purchase}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
