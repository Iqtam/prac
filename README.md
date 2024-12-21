# Bitfest Hackathon- Recipe Management API Documentation

-Route: /api/ingredients/add
Method: POST
Request Body:
```json
[
    {
        "name": "Tomato",
        "quantity": 5,
        "unit": "pcs"
    }
]
```
Sample Response:
```json
[
    {
        "message": "Ingredient added successfully."
    }
]
```

-Route: /api/ingredients/update/:id
Method: PUT
Request Body:
```json
[
    {
        "quantity": 10,
        "unit": "pcs"
    }
]
```
Sample Response:
```json
[
    {
        "message": "Ingredient updated successfully."
    }
]
```

-Route: /api/ingredients/
Method: GET
Sample Response:
```json
[
  {
    "name": "Tomato",
    "quantity": 5,
    "unit": "pcs"
  },
  {
    "name": "Onion",
    "quantity": 3,
    "unit": "pcs"
  }
]
```

-Route: /api/recipes/add-text
Method: POST
Request Body:
```json
[
    {
        "name": "Pasta",
        "ingredients": "Pasta, Tomato Sauce, Cheese",
        "instructions": "Boil pasta, add sauce, top with cheese.",
        "cuisine": "Italian",
        "taste": "Savory",
        "prepTime": "30 minutes",
        "reviews": "4.5/5"
    }
]
```
Sample Response:
```json
[
    {
        "message": "Recipe added successfully."
    }
]
```

-Route: /api/recipes/upload
Method: POST
Request: Multipart form data with an image file.
Sample Response:
```json
[
    {
        "message": "Recipe uploaded successfully via OpenAI Vision OCR.",
        "extracted_text": "Boil pasta, add sauce, top with cheese."
    }

]
```

-Route: /api/recipes
Method: GET
Sample Response:
```json
[
  {
    "name": "Pasta",
    "ingredients": "Pasta, Tomato Sauce, Cheese",
    "instructions": "Boil pasta, add sauce, top with cheese.",
    "cuisine": "Italian",
    "taste": "Savory",
    "prepTime": "30 minutes",
    "reviews": "4.5/5"
  }
]
```



-Route: /api/chatbot/chat
Method: POST
Request Body:
```json
[
    {
        "userInput": "I want something sweet"
    }
]
```
Sample Response:
```json
[
    {
        "reply": "How about trying our Chocolate Cake recipe?"
    }
]
```

