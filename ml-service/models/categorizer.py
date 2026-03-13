"""TransactionCategorizer - Categorizes transactions using TF-IDF + Naive Bayes."""

from __future__ import annotations

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from typing import Any


# Pre-built training data with common Argentine spending descriptions
_DEFAULT_TRAINING_DATA: list[tuple[str, str]] = [
    # Alimentacion
    ("supermercado carrefour", "Alimentación"),
    ("supermercado coto", "Alimentación"),
    ("supermercado dia", "Alimentación"),
    ("supermercado jumbo", "Alimentación"),
    ("supermercado disco", "Alimentación"),
    ("verdulería", "Alimentación"),
    ("carnicería", "Alimentación"),
    ("panadería pan", "Alimentación"),
    ("almacén barrio", "Alimentación"),
    ("compra alimentos", "Alimentación"),
    ("frutas verduras", "Alimentación"),
    ("fiambrería", "Alimentación"),
    ("dietética", "Alimentación"),
    # Transporte
    ("uber viaje", "Transporte"),
    ("cabify taxi", "Transporte"),
    ("sube carga transporte", "Transporte"),
    ("nafta ypf combustible", "Transporte"),
    ("nafta shell", "Transporte"),
    ("peaje autopista", "Transporte"),
    ("estacionamiento cochera", "Transporte"),
    ("taxi remis", "Transporte"),
    ("didi viaje", "Transporte"),
    # Entretenimiento
    ("cine hoyts", "Entretenimiento"),
    ("teatro entradas", "Entretenimiento"),
    ("recital show concierto", "Entretenimiento"),
    ("videojuego steam", "Entretenimiento"),
    ("parque diversiones", "Entretenimiento"),
    ("escape room", "Entretenimiento"),
    ("bowling boliche", "Entretenimiento"),
    # Salud
    ("farmacia farmacity", "Salud"),
    ("farmacia del pueblo", "Salud"),
    ("médico consulta", "Salud"),
    ("odontólogo dentista", "Salud"),
    ("obra social prepaga", "Salud"),
    ("medicamentos remedios", "Salud"),
    ("análisis laboratorio", "Salud"),
    ("óptica lentes anteojos", "Salud"),
    # Educacion
    ("curso online udemy", "Educación"),
    ("curso platzi", "Educación"),
    ("universidad facultad cuota", "Educación"),
    ("libros librería", "Educación"),
    ("academia idiomas inglés", "Educación"),
    ("taller capacitación", "Educación"),
    ("coursera curso", "Educación"),
    # Ropa
    ("zara ropa", "Ropa"),
    ("nike zapatillas", "Ropa"),
    ("adidas ropa deportiva", "Ropa"),
    ("remera pantalón jean", "Ropa"),
    ("tienda ropa indumentaria", "Ropa"),
    ("calzado zapatos", "Ropa"),
    # Hogar
    ("expensas departamento", "Hogar"),
    ("alquiler mensual", "Hogar"),
    ("muebles decoración", "Hogar"),
    ("limpieza productos", "Hogar"),
    ("ferretería herramientas", "Hogar"),
    ("electrodoméstico", "Hogar"),
    # Servicios
    ("edenor edesur luz electricidad", "Servicios"),
    ("metrogas gas natural", "Servicios"),
    ("aysa agua", "Servicios"),
    ("fibertel telecentro internet", "Servicios"),
    ("movistar personal claro celular", "Servicios"),
    ("directv cable televisión", "Servicios"),
    # Seguros
    ("seguro auto mapfre", "Seguros"),
    ("seguro hogar vivienda", "Seguros"),
    ("seguro vida póliza", "Seguros"),
    ("la caja seguros", "Seguros"),
    # Impuestos
    ("afip monotributo", "Impuestos"),
    ("arba impuesto provincial", "Impuestos"),
    ("abl municipalidad", "Impuestos"),
    ("patente auto vehículo", "Impuestos"),
    ("ganancias impuesto", "Impuestos"),
    # Tecnologia
    ("mouse teclado periférico", "Tecnología"),
    ("auriculares bluetooth", "Tecnología"),
    ("notebook laptop computadora", "Tecnología"),
    ("celular smartphone teléfono", "Tecnología"),
    ("mercadolibre electrónica", "Tecnología"),
    ("cable cargador usb", "Tecnología"),
    # Restaurantes
    ("restaurante cena almuerzo", "Restaurantes"),
    ("parrilla asado", "Restaurantes"),
    ("delivery rappi pedidosya", "Restaurantes"),
    ("café cafetería starbucks", "Restaurantes"),
    ("pizzería pizza", "Restaurantes"),
    ("hamburguesería burger", "Restaurantes"),
    ("sushi japonés", "Restaurantes"),
    # Suscripciones
    ("netflix suscripción", "Suscripciones"),
    ("spotify premium música", "Suscripciones"),
    ("disney plus streaming", "Suscripciones"),
    ("hbo max", "Suscripciones"),
    ("amazon prime", "Suscripciones"),
    ("youtube premium", "Suscripciones"),
    ("xbox game pass", "Suscripciones"),
    ("star plus", "Suscripciones"),
    # Regalos
    ("regalo cumpleaños", "Regalos"),
    ("regalo navidad", "Regalos"),
    ("obsequio presente", "Regalos"),
    ("flores bombones", "Regalos"),
    # Viajes
    ("hotel hospedaje", "Viajes"),
    ("aerolíneas vuelo pasaje", "Viajes"),
    ("booking airbnb alojamiento", "Viajes"),
    ("excursión tour", "Viajes"),
    ("escapada fin de semana", "Viajes"),
    # Mascotas
    ("veterinaria control vacuna", "Mascotas"),
    ("alimento mascota perro gato", "Mascotas"),
    ("pet shop accesorios", "Mascotas"),
    ("royal canin eukanuba", "Mascotas"),
    # Ingresos
    ("salario sueldo mensual", "Salario"),
    ("aguinaldo sac", "Salario"),
    ("proyecto freelance diseño", "Freelance"),
    ("trabajo independiente", "Freelance"),
    ("dividendos fci inversión", "Inversiones"),
    ("intereses plazo fijo", "Inversiones"),
    ("rendimiento bonos", "Inversiones"),
    ("venta artículos usados", "Otros Ingresos"),
    ("reembolso devolución", "Otros Ingresos"),
]


class TransactionCategorizer:
    """Categorizes transaction descriptions using TF-IDF + MultinomialNB."""

    def __init__(self) -> None:
        self._pipeline: Pipeline | None = None
        self._is_trained: bool = False
        self._categories: list[str] = []

    def train_with_defaults(self) -> dict[str, Any]:
        """Train the model using the pre-built fallback dataset."""
        descriptions = [d for d, _ in _DEFAULT_TRAINING_DATA]
        categories = [c for _, c in _DEFAULT_TRAINING_DATA]
        return self.train(descriptions, categories)

    def train(self, descriptions: list[str], categories: list[str]) -> dict[str, Any]:
        """
        Fit TF-IDF + MultinomialNB on description-category pairs.

        Args:
            descriptions: List of transaction description strings.
            categories: List of corresponding category names.

        Returns:
            Training summary.
        """
        if not descriptions or not categories or len(descriptions) != len(categories):
            return {"status": "invalid_data", "samples": 0}

        # Filter out empty strings
        pairs = [(d, c) for d, c in zip(descriptions, categories) if d.strip() and c.strip()]
        if len(pairs) < 2:
            return {"status": "insufficient_data", "samples": len(pairs)}

        clean_descriptions = [d for d, _ in pairs]
        clean_categories = [c for _, c in pairs]

        self._pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(
                lowercase=True,
                max_features=5000,
                ngram_range=(1, 2),
                sublinear_tf=True,
            )),
            ("clf", MultinomialNB(alpha=0.1)),
        ])

        self._pipeline.fit(clean_descriptions, clean_categories)
        self._categories = list(set(clean_categories))
        self._is_trained = True

        return {
            "status": "trained",
            "samples": len(clean_descriptions),
            "categories": sorted(self._categories),
        }

    def predict(self, description: str, top_n: int = 3) -> list[tuple[str, float]]:
        """
        Predict the top N category suggestions for a transaction description.

        Args:
            description: Transaction description text.
            top_n: Number of top suggestions to return.

        Returns:
            List of (category, confidence) tuples sorted by confidence descending.
        """
        if not self._is_trained or self._pipeline is None:
            return [("Otros Ingresos", 0.5)]

        if not description.strip():
            return [("Otros Ingresos", 0.5)]

        probabilities = self._pipeline.predict_proba([description.lower()])[0]
        classes = self._pipeline.classes_

        # Sort by probability descending and take top N
        top_indices = np.argsort(probabilities)[::-1][:top_n]

        results: list[tuple[str, float]] = []
        for idx in top_indices:
            results.append((str(classes[idx]), float(probabilities[idx])))

        return results
