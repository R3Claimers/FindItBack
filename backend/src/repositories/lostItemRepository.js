const itemRepository = require("./itemRepository");

module.exports = {
  create(data) {
    return itemRepository.create("lost", data);
  },
  findById(id) {
    return itemRepository.findById("lost", id);
  },
  findAll(filters, page, limit) {
    return itemRepository.findAll("lost", filters, page, limit);
  },
  findByUserId(userId, page, limit) {
    return itemRepository.findByUserId("lost", userId, page, limit);
  },
  update(id, userId, updateData) {
    return itemRepository.update("lost", id, userId, updateData);
  },
  delete(id, userId) {
    return itemRepository.delete("lost", id, userId);
  },
  search(searchTerm, page, limit) {
    return itemRepository.search("lost", searchTerm, page, limit);
  },
  findActiveItems() {
    return itemRepository.findActiveItems("lost");
  },
};
