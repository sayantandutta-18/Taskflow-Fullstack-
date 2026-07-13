function Button({ children, ...props }) {
  return (
    <button
      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition duration-300"
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;