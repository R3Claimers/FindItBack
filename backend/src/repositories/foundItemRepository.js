const itemRepository = require("./itemRepository");

module.exports = {
  create(data) {
    return itemRepository.create("found", data);
  },
  findById(id) {
    return itemRepository.findById("found", id);
  },
  findAll(filters, page, limit) {
    return itemRepository.findAll("found", filters, page, limit);
  },
  findByUserId(userId, page, limit) {
    return itemRepository.findByUserId("found", userId, page, limit);
  },
  update(id, userId, updateData) {
    return itemRepository.update("found", id, userId, updateData);
  },
  delete(id, userId) {
    return itemRepository.delete("found", id, userId);
  },
  search(searchTerm, page, limit) {
    return itemRepository.search("found", searchTerm, page, limit);
  },
  findActiveItems() {
    return itemRepository.findActiveItems("found");
  },
};
