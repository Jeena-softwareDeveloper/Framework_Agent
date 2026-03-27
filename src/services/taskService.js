import { Task } from '../models/core/tasks.js';
import { logger } from '../utils/logger.js';

export const taskService = {
  async addTask(data) {
    try {
      const task = await new Task(data).save();
      logger.success(`Task Created: ${task.title}`);
      return task;
    } catch (e) {
      logger.error(`Add Task Error: ${e.message}`);
      throw e;
    }
  },

  async listTasks() {
    return await Task.find().sort({ createdAt: -1 });
  },

  async removeTask(search) {
    // Search can be ID or part of title
    const query = mongoose.Types.ObjectId.isValid(search) 
      ? { _id: search } 
      : { title: new RegExp(search, 'i') };
    const res = await Task.deleteOne(query);
    return res.deletedCount > 0;
  },

  async updateTask(search, updates) {
    const query = mongoose.Types.ObjectId.isValid(search) 
      ? { _id: search } 
      : { title: new RegExp(search, 'i') };
    const res = await Task.findOneAndUpdate(query, updates, { new: true });
    return res;
  }
};
