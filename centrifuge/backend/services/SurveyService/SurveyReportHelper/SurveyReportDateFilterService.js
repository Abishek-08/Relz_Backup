exports.buildDateFilter = (from, to) => {
  if (!from && !to) return {};
 
  const filter = { createdAt: {} };
 
  if (from) filter.createdAt.$gte = new Date(from);
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    filter.createdAt.$lte = end;
  }
 
  return filter;
};
 