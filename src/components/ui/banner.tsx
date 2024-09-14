export default function Banner() {
  return (
    <div className="flex items-center justify-center h-full mt-10">
      <div className="bg-gradient-to-r from-[#f1f3f5] to-[#e9ecef] py-8 px-6 rounded-lg">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#343a40]">
            No coins to display, Start by adding new Coins.
          </h2>
          <p className="mt-2 text-[#495057] text-sm">
            Click the button above to add a new coins.
          </p>
        </div>
      </div>
    </div>
  );
}
