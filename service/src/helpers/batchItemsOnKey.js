export const batchItemsOnKey = (items, key) => {
  return items.reduce((acc, item) => {
    acc[item[key]] = [...(acc[item[key]] || []), item];
    return acc;
  }, {});
};
