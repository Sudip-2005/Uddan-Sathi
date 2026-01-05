
import { db } from "../../firebase/initFirebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

type RequestPayload = {
  airport_code: string;
  flight_id: string;
  passenger_id: string;
  name?: string;
  pnr?: string;
  upi_id?: string;
  amount?: number;
  reason?: string;
  request_type?: string; // refund, hotel, rebook
};

const COLLECTION = "refund_requests";

export async function requestRefund(payload: RequestPayload) {
  if (!db) throw new Error("Firestore not initialized");
  const ref = collection(db, COLLECTION);
  const docRef = await addDoc(ref, {
    ...payload,
    status: "pending",
    request_type: payload.request_type || "refund",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export function listenRefundsByFlight(
  airport: string,
  flightId: string,
  onUpdate: (items: any[]) => void
) {
  if (!db) return () => {};
  const ref = collection(db, COLLECTION);
  const q = query(
    ref,
    where("airport_code", "==", airport),
    where("flight_id", "==", flightId),
    orderBy("createdAt", "desc")
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const items: any[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      if (data.status === "pending") items.push({ id: d.id, ...data });
    });
    onUpdate(items);
  });
  return unsubscribe;
}

export async function markRequestCompleted(docId: string) {
  if (!db) throw new Error("Firestore not initialized");
  const d = doc(db, COLLECTION, docId);
  await updateDoc(d, { status: "completed", processedAt: serverTimestamp() });
}

export async function assignResource(docId: string, resource: { type: string; details?: any }) {
  if (!db) throw new Error("Firestore not initialized");
  const d = doc(db, COLLECTION, docId);
  await updateDoc(d, { resourceAssigned: resource, resourceAssignedAt: serverTimestamp() });
}
