import { today, getLocalTimeZone } from "@internationalized/date";

import { Calendar } from "@/components/Calendar";

import "@/index.css";

export function App() {
  console.log("hello");

  return (
    <div className="mt-12 container mx-auto">
      <div className="hero bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4 w-1/2">
        <section>calendar</section>
        <Calendar
          minValue={today(getLocalTimeZone())}
          defaultValue={today(getLocalTimeZone())}
        />
      </div>
      <div className="flex gap-x-2 mt-12">
        <button className="btn">Button</button>
        <button className="btn btn-primary">Button</button>
      </div>
    </div>
  );
}
