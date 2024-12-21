# Bitfest Hackathon- Recipe Management API Documentation

-Route: /api/ingredients/add<br/>
Method: POST<br/>
Request Body:<br/>
```json
[
    {
        "name": "Tomato",
        "quantity": 5,
        "unit": "pcs"
    }
]
```
Sample Response:<br/>
```json
[
    {
        "message": "Ingredient added successfully."
    }
]
```

-Route: /api/ingredients/update/:id<br/>
Method: PUT<br/>
Request Body:<br/>
```json
[
    {
        "quantity": 10,
        "unit": "pcs"
    }
]
```
Sample Response:<br/>
```json
[
    {
        "message": "Ingredient updated successfully."
    }
]
```

-Route: /api/ingredients/<br/>
Method: GET<br/>
Sample Response:<br/>
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

-Route: /api/recipes/add-text<br/>
Method: POST<br/>
Request Body:<br/>
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
Sample Response:<br/>
```json
[
    {
        "message": "Recipe added successfully."
    }
]
```

-Route: /api/recipes/upload<br/>
Method: POST<br/>
Request: Multipart form data with an image file.<br/>
Sample Response:<br/>
```json
[
    {
        "message": "Recipe uploaded successfully via OpenAI Vision OCR.",
        "extracted_text": "Boil pasta, add sauce, top with cheese."
    }

]
```

-Route: /api/recipes<br/>
Method: GET<br/>
Sample Response:<br/>
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



-Route: /api/chatbot/chat<br/>
Method: POST<br/>
Request Body:<br/>
```json
[
    {
        "userInput": "I want something sweet"
    }
]
```
Sample Response:<br/>
```json
[
    {
        "reply": "How about trying our Chocolate Cake recipe?"
    }
]
```

