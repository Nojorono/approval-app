const ActIndicator = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></span>
      <span className="ml-3 text-orange-600 font-semibold">Loading...</span>
    </div>
  );
};

export default ActIndicator;
