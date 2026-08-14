import { api } from "./api";

export const getEvents = async () => {
  const response = await api.get("/events/");
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}/`);

  return response.data;
};

export const getEventDetail = async (eventoId) => {
  const response = await api.get(`/events/${eventoId}/`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await api.post("/events/create/", eventData);
  return response.data;
};

export const editEvent = async (eventoId, eventData) => {
  const response = await api.put(
    `/events/edit/${eventoId}/`,
    eventData
  );

  return response.data;
};

export const deleteEvent = async (eventoId) => {
  const response = await api.delete(
    `/events/delete/${eventoId}/`
  );

  return response.data;
};
