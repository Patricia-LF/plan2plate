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
- API requests to Spoonacular
- Creating PDF files with PDFKit
- Email sending with Nodemailer
- Simple frontend for presentation
