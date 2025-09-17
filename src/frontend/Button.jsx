
export default function Button({ children, onClick, type = "button", variant = "primary" }) {
  const base = "px-4 py-2 rounded font-semibold transition";
  const styles = {
    primary: base + " bg-blue-600 text-white hover:bg-blue-700",
    secondary: base + " bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  return (
    <button type={type} onClick={onClick} className={styles[variant]}>
      {children}
    </button>
  );
}
