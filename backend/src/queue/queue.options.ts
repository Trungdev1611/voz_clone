export const defaultQueueOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
  removeOnComplete: { count: 100},  //nếu true sẽ xoá sau khi hoàn thành/ false ngược lại sẽ giữ lại / time sẽ là xoá sau khi hoàn thành 1 ngày
  removeOnFail: { count: 100}, //nếu true sẽ xoá sau số lần attempts thất bại/ false ngược lại sẽ giữ lại
  timeout: 10000,
};
