import Modal from "./Modal";

function LabHomeItemModal({ type, item, labName, onClose, onSubmit }) {
  const inputClassName =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";
  const itemName = type === "announcement"
    ? "announcement"
    : type === "attention"
      ? "item needing attention"
      : "publication";

  return (
    <Modal titleId="add-lab-home-item-title" onClose={onClose} className="max-w-xl">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <h2 id="add-lab-home-item-title" className="text-xl font-bold text-slate-900">
            {item ? "Edit" : "Add"} {itemName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">This item will be saved for {labName}.</p>
        </div>
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input
            name="title"
            required
            maxLength={160}
            defaultValue={item?.title ?? ""}
            className={inputClassName}
          />
        </label>
        {type === "publication" ? (
          <>
            <label className="block text-sm font-medium text-slate-700">
              Authors <span className="font-normal text-slate-500">(comma-separated)</span>
              <input
                name="authors"
                required
                defaultValue={item?.authors.join(", ") ?? ""}
                placeholder="A. Researcher, B. Scientist"
                className={inputClassName}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Journal
                <input name="journal" required defaultValue={item?.journal ?? ""} className={inputClassName} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Year
                <input
                  name="year"
                  type="number"
                  min="1000"
                  max="9999"
                  required
                  defaultValue={item?.year ?? new Date().getFullYear()}
                  className={inputClassName}
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-700">
              Paper URL <span className="font-normal text-slate-500">(optional)</span>
              <input
                name="url"
                type="url"
                defaultValue={item?.url === "#" ? "" : item?.url ?? ""}
                placeholder="https://"
                className={inputClassName}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Tags <span className="font-normal text-slate-500">(comma-separated, optional)</span>
              <input name="tags" defaultValue={item?.tags.join(", ") ?? ""} className={inputClassName} />
            </label>
          </>
        ) : (
          <>
            <label className="block text-sm font-medium text-slate-700">
              Description
              <textarea
                name="description"
                required
                rows="3"
                defaultValue={item?.description ?? ""}
                className={inputClassName}
              />
            </label>
            {type === "attention" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Priority
                  <select name="priority" defaultValue={item?.priority ?? "Medium"} className={`${inputClassName} bg-white`}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Category
                  <input
                    name="category"
                    required
                    defaultValue={item?.category ?? ""}
                    placeholder="Training, inventory, equipment..."
                    className={inputClassName}
                  />
                </label>
              </div>
            )}
          </>
        )}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {item ? "Save changes" : "Save item"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default LabHomeItemModal;
