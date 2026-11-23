export default function Home() {
  return (
    <main
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "30px 20px",
        textAlign: "center",
      }}
    >
      <section>
        <h1 style={{ fontSize: "36px", marginBottom: "28px" }}>
          Welcome to NoteHub
        </h1>

        <p
          style={{
            fontSize: "22px",
            lineHeight: 2,
            marginBottom: "28px",
            textAlign: "left",
          }}
        >
          NoteHub is a simple and efficient application designed for managing
          personal notes. It helps keep your thoughts organized and accessible
          in one place,
          <br />
          whether you&apos;re at home or on the go.
        </p>

        <p
          style={{
            fontSize: "22px",
            lineHeight: 2,
            marginBottom: "28px",
            textAlign: "left",
          }}
        >
          The app provides a clean interface for writing, editing, and browsing
          notes. With support for keyword search and structured organization,
          NoteHub offers a
          <br />
          streamlined experience for anyone who values clarity and productivity.
        </p>
      </section>
    </main>
  );
}
