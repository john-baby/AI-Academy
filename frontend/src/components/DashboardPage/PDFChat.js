import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, Button, List, ListItem, IconButton } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { marked } from "marked";
import { Document, Page, pdfjs } from "react-pdf";

// Set the workerSrc for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const PDFChat = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPage, setSelectedPage] = useState(1);
  const messageEndRef = useRef(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
  
      // Create a FormData object to include the file in the POST request
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const response = await fetch("http://127.0.0.1:5000/pdf/upload_document/", {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            alert(`File uploaded successfully: ${data.filename}`);
            // Generate summary only after a successful upload
            await generateSummary(data.filename);
          } else {
            alert(`Upload failed: ${data.message}`);
          }
        } else {
          alert(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("An error occurred while uploading the file.");
      }
    } else {
      alert("No file selected. Please select a file to upload.");
    }
  };
  
  const generateSummary = async (filename) => {
    try {
      const newQuery = { role: "user", content: "Generate a summary of this document" };
      setMessages((prevMessages) => [...prevMessages, newQuery]);
      const response = await fetch("http://127.0.0.1:5000/pdf/summarize/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }), // Use the filename from server response
      });
  
      const data = await response.json();
      if (response.ok) {
        const newMessage = { role: "assistant", content: data.summary };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else {
        alert(data.message || "Query failed");
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      alert("An error occurred while generating the summary.");
    }
  };
  
  const sendMessage = async () => {
    if (!prompt || !selectedFile) {
      alert("Please enter a prompt and upload a file first.");
      return;
    }

    const newQuery = { role: "user", content: prompt };
    setMessages((prevMessages) => [...prevMessages, newQuery]);
    setPrompt("");
    try {
      const response = await fetch("http://127.0.0.1:5000/pdf/rag_query/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt, filename: selectedFile.name }),
      });

      const data = await response.json();
      if (response.ok) {
        const newMessage = { role: "assistant", content: data.response };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else {
        alert(data.message || "Query failed");
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  const handlePrevious = () => {
    setSelectedPage((prev) => prev - 1);
  };

  const handleNext = () => {
    setSelectedPage((prev) => prev + 1);
  };

  return (
    <Box display="flex" height="100vh" bgcolor="#1e1e1e" color="#e4e4e4">
      {/* PDF Viewer Section */}
      <Box
        width="50%"
        p={2}
        borderRight="1px solid #333"
        display="flex"
        flexDirection="column"
        bgcolor="#1e1e1e"
      >
        <Typography variant="h5" gutterBottom sx={{ color: "#64b5f6" }}>
          PDF Viewer
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            paddingRight: "10px",
            boxShadow: "inset 0 0 10px #444",
          }}
        >
          {pdfUrl && (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<Typography>Loading PDF...</Typography>}
            >
              <Page
                key={`page_${selectedPage}`}
                pageNumber={selectedPage}
                renderTextLayer={false}
                loading={<Typography>Loading page {selectedPage}</Typography>}
              />
            </Document>
          )}
        </Box>
        <Box
          p={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="contained"
            onClick={handlePrevious}
            disabled={selectedPage === 1}
            sx={{ backgroundColor: "#64b5f6", color: "#fff" }}
          >
            Previous
          </Button>
          <Typography>
            Page {selectedPage} of {numPages}
          </Typography>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={selectedPage === numPages}
            sx={{ backgroundColor: "#64b5f6", color: "#fff" }}
          >
            Next
          </Button>
        </Box>
      </Box>

      {/* Chat Interface Section */}
      <Box width="50%" p={2} display="flex" flexDirection="column" bgcolor="#1e1e1e">
        <Typography variant="h5" gutterBottom sx={{ color: "#64b5f6" }}>
          Chat with AI
        </Typography>
        <List
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            boxShadow: "inset 0 0 10px #444",
          }}
        >
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                justifyContent: message.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Typography
                dangerouslySetInnerHTML={{ __html: message.content ? marked(message.content) : "" }}
                sx={{
                  padding: "10px",
                  borderRadius: "5px",
                  maxWidth: "80%",
                  wordWrap: "break-word",
                  backgroundColor: message.role === "user" ? "#d1e7dd" : "#444",
                  color: message.role === "user" ? "#000" : "#e4e4e4",
                }}
              />
              <div ref={messageEndRef} />
            </ListItem>
          ))}
        </List>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            backgroundColor: "#2c2c2c",
            borderTop: "1px solid #333",
          }}
        >
          <IconButton
            component="label"
            sx={{ color: "#64b5f6", marginRight: "10px" }}
          >
            <UploadFile />
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf"
              hidden
            />
          </IconButton>
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{
              marginRight: "10px",
              backgroundColor: "#1e1e1e",
              input: { color: "#e4e4e4" },
            }}
          />
          <Button variant="contained" color="primary" onClick={sendMessage}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PDFChat;
