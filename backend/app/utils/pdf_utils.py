import os
import google.generativeai as genai
from typing import List, Optional
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

ALLOWED_EXTENSIONS = {'pdf', 'txt', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
import os

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

        # Use PDF filename to create unique FAISS index
        pdf_filename = os.path.basename(pdf_path).split('.')[0]
        self.faiss_index_path = f"faiss_index_{pdf_filename}"

        # Load or process PDF
        self._load_or_process_pdf(pdf_path)

    def _load_or_process_pdf(self, pdf_path: str) -> None:
        """Load FAISS index if exists; otherwise, process the PDF and save embeddings"""
        if os.path.exists(self.faiss_index_path):
            print(f"Loading existing FAISS index: {self.faiss_index_path}")
            try:
                self.vector_store = FAISS.load_local(
                    self.faiss_index_path, 
                    self.embeddings,
                    allow_dangerous_deserialization=True
                )
            except Exception as e:
                print(f"Error loading FAISS index: {str(e)}. Rebuilding index...")
                self._process_pdf_and_save(pdf_path)
        else:
            print(f"Processing PDF and generating embeddings for {pdf_path}...")
            self._process_pdf_and_save(pdf_path)

    def _process_pdf_and_save(self, pdf_path: str) -> None:
        """Process PDF, generate embeddings, and save FAISS index"""
        pdf_reader = PdfReader(pdf_path)
        text = "".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_text(text=text)
        self.vector_store = FAISS.from_texts(chunks, self.embeddings)

        # Save FAISS index uniquely for each file
        self.vector_store.save_local(self.faiss_index_path)


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
