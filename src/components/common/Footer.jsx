export function Footer() {
  return (
    <footer style={{
      textAlign: "center",
      padding: "16px",
      fontSize: "12px",
      color: "#9ca3af",
      borderTop: "1px solid #f3f4f6",
      marginTop: "40px"
    }}>
      UI components by{" "}
      <a
        href="https://meeedly.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#4F6EF7", fontWeight: 600 }}
      >
        Meeedly
      </a>
    </footer>
  );
}