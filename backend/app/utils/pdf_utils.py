import google.generativeai as genai
from typing import List, Optional
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

ALLOWED_EXTENSIONS = {'pdf', 'txt', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class RAGSystem:
    def __init__(self, 
                 pdf_path: str, 
                 api_key: Optional[str] = None,
                 model_name: str = "gemini-1.5-flash"):
        """Initialize RAG system with PDF and Gemini"""
        if api_key:
            genai.configure(api_key=api_key)
        
        self.model = genai.GenerativeModel(model_name)
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.vector_store = None
        self._process_pdf(pdf_path)

    def _process_pdf(self, pdf_path: str) -> None:
        pdf_reader = PdfReader(pdf_path)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_text(text=text)
        self.vector_store = FAISS.from_texts(chunks, self.embeddings)

    def retrieve_context(self, query: str, top_k: int = 3) -> List[str]:
        """Retrieve most relevant chunks for a query"""
        relevant_chunks = self.vector_store.similarity_search(query, k=top_k)
        return [chunk.page_content for chunk in relevant_chunks]

    def generate_response(self, query: str, context: Optional[List[str]] = None) -> str:
        """Generate response using Gemini with optional context"""
        if context is None:
            context = self.retrieve_context(query)
        
        augmented_prompt = f"""
        
        Context: {' '.join(context)}
        
        Query: {query}
        
        You are an educational tutor. Always respond like a teacher, adapting to the user's query.
        Based on the context, provide a comprehensive and precise answer to the query.
        If the answer cannot be found in the context, state that clearly.
        """
        
        try:
            response = self.model.generate_content(augmented_prompt)
            return response.text
        except Exception as e:
            return f"Error generating response: {str(e)}"