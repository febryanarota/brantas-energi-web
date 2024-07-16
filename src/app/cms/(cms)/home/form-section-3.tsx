import { Button } from "@nextui-org/button";

export default function FormSection3() {
  return (
    <form
      action=""
      className="flex flex-col p-5  gap-2 bg-white rounded-md shadow-sm"
    >
      <p className="font-bold text-primaryBlue mb-2">Section 3</p>
      <div className="flex flex-col justify-center w-full">
        <label htmlFor="heading3" className="label text-sm">
          Heading
        </label>
        <input type="text" name="heading3" className="field" />
      </div>
      <div className="flex flex-col justify-center w-full">
        <label htmlFor="subheading3" className="label text-sm">
          Sub-Heading
        </label>
        <input type="text" name="subheading3" className="field" />
      </div>
      <div className="flex flex-col justify-center w-full">
        <label htmlFor="description2" className="label text-sm">
          Description
        </label>
        <textarea name="description2" className="field" />
      </div>
      <div>
        <label htmlFor="image2" className="label text-sm">
          Image
        </label>
        <div className="field w-full flex flex-row items-center">
          <span className="grow">fileName</span>
          <input
            type="file"
            id="image2"
            className="absolute opacity-0 cursor-pointer"
            // onChange={handleFileChange}
          />
          <label
            htmlFor="image2"
            className="hover:bg-sky-900 hover:cursor-pointer hover:text-white border-1 border-slate-400 px-3 text-sm rounded-lg items-center justify-center py-2  transition-all duration-300 ease-in-out"
          >
            choose a file
          </label>
        </div>
      </div>
      <Button
        type="submit"
        className="submit-btn self-end mt-0 mr-2"
        // disabled={isLoading || isFetching}
      >
        Save
        {/* {isLoading ? "Saving..." : "Save"} */}
      </Button>
    </form>
  );
}
