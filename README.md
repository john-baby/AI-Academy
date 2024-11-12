# AI-Academy: Personalized Learning Platform (Final Year Project)

AI-Academy is my final year project, aiming to create a personalized learning platform that adapts to each student's needs and comprehension levels. The platform uses advanced AI and machine learning models to tailor educational content, making learning more engaging and effective. 

### Phase 1: Doubt-Clearing Chatbot
For Phase 1 of this project, I've implemented a doubt-clearing chatbot, which is currently available in this repository. The chatbot leverages OpenAI's language model to answer questions based on content extracted from uploaded PDFs. By breaking down the document text into chunks, generating embeddings for each chunk, and using cosine similarity to match user queries with relevant content, the chatbot provides accurate responses to user questions.

### Key Features of the Chatbot
- **PDF Processing**: Extracts and chunks text from uploaded PDF files for easy retrieval.
- **Embeddings and Similarity Search**: Uses OpenAI embeddings to match user queries with the most relevant document sections.
- **Dynamic Answer Generation**: Generates answers based on the extracted document content and user queries.
- **Flask Web Interface**: Allows users to upload PDFs and ask questions through a simple web interface.

### Project Structure

```plaintext
├── app.py                  # Main application file for running the Flask app
├── templates/              # HTML templates for rendering the web interface
│   ├── index.html          # File upload and main page
│   └── ask.html            # Question asking and answer display page
├── requirements.txt        # List of dependencies
├── README.md               # Project documentation
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/john-baby/AI-Academy.git
   cd AI-Academy
   ```

2. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Set your OpenAI API key:
   Open `app.py` and replace YOUR_API_KEY with your actual OpenAI API key.

### Usage

1. **Run the application**:
   ```bash
   python app.py
   ```

2. **Access the web interface**:
   Open your browser and go to `http://127.0.0.1:5000/` to access the chatbot interface.

3. **Upload a PDF and Ask Questions**:
   - Upload a PDF document through the main page.
   - Navigate to the question page to ask questions based on the document's content.

### Future Enhancements for AI-Academy

In future phases, AI-Academy will expand to include:
1. **Adaptive Learning Module**: A personalized recommendation system for educational content based on students' knowledge levels.
2. **Gamification and Progress Tracking**: To increase motivation and engagement.
3. **Cross-Platform Access**: Expanding support to web and mobile platforms for flexibility.


### Contact

For questions, feedback, or collaboration, please reach out to [John Baby](mailto:johnbaby5646@gmail.com).

---

*AI-Academy: Building the future of personalized education through intelligent, adaptive learning.*
```
