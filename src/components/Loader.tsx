const Loader = () => {
  return (
    <div className="fixed top-20 left-0 bg-white flex items-center justify-center h-screen w-full">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
