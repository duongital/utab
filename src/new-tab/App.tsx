import { today, getLocalTimeZone } from "@internationalized/date";

import { Calendar } from "./components/Calendar";

import "@/index.css";

export function App() {
  console.log("hello");
  return (
    <div className="container mx-auto">
      <div className="flex gap-x-4">
        <section>to do list</section>
        <section>calendar</section>

        <Calendar
          minValue={today(getLocalTimeZone())}
          defaultValue={today(getLocalTimeZone())}
        />
      </div>
    </div>
  );
}
