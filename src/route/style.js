export const style = {
  btnUniversal:
    "mb-3 px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold",
  btnPink:
    "mb-3 px-7 py-3 bg-[#d44b93] hover:bg-pink-500 text-white rounded-full text-xs font-semibold",
  link: "py-3 px-6 mb-5 text-xs font-semibold cursor-pointer hover:text-[#e3e1f8]  rounded-xl block text-[#a3a0c2] text-left",
  btnPagination: function (activeButton, i) {
    return `border hover:bg-indigo-500 rounded-xl text-sm font-bold text-white border-indigo-600 py-2 px-5 ml-3 ${
      activeButton == i + 1 && "bg-indigo-600"
    }`;
  },
};
