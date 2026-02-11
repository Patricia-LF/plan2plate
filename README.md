# Plan2Plate

This is a school project in node.js where we use the open API Spoonacular (https://spoonacular.com/food-api) to search for recipes based on ingredients, cuisines or special diets/intolerances. When you find something you love, save it as a PDF or send it straight to your inbox - perfect for simple grocery shopping without juggling screenshots, sticky notes or endless copy-paste.

## Installation

git clone https://github.com/Patricia-LF/plan2plate.git
In Terminal at root of project: npm install (this installs all dependencies listed in package.json)

## MVP

### 1. START PAGE (Search View)

Simple search interface where user can write search terms (such as ingredients, cuisine type, etc)
User clicks “Search” or press Enter.
API request -> Spoonacular, displays up to 12 recipe results below the input field.

Each recipe card includes image, title, ready in minutes, servings and a "View recipe" button.

### 2. RECIPE PAGE (Recipe View)

When user selects a recipe -> redirection to next page with recipe details are presented:
image, title, ready in minutes, servings, download PDF button, Email recipe button, ingredient list, list with instructions.

#### A. “Download PDF”

Generates a pdf with PDFKit, containing title, image, ingredients & instructions. The PDF is downloaded directly to the user's device.

#### B. “Email recipe”

Includes an input field where user types in their email address. User clicks send. Backend generates a PDF with PDFKit and sends it as an email with attachment using nodemailer.

### 3. Technical requirements:

- Backend built with Node & Express
- Axios to make HTTP requests from client-side
- API requests to Spoonacular
- Creating PDF files with PDFKit
- Email sending with Nodemailer
- Simple frontend for presentation
