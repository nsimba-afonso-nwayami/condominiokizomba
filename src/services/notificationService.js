import { api } from "./api";

export const checkNotifications = async () => {
  const response = await api.post("/check_notifications/");
  return response.data;
};

export const markNotificationsRead = async () => {
  const response = await api.post(
    "/mark_notifications_read/"
  );

  return response.data;
};
