import { supabaseServerComponentClient } from "@/utils/supabaseServer";
import { camelize } from "@/utils/utils";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default async function Review({ params }: { params: { id: string } }) {
  const supabase = await supabaseServerComponentClient();

  const { data: review } = camelize(
    await supabase
      .from("reviews")
      .select("*, users!inner(username), detailed_score(*)")
      .eq("id", params.id)
      .single(),
  );
  const markdown = {
    description: review.longReview,
  };
  console.log(review);
  return (
    <div className="flex flex-col justify-items-center gap-8">
      <h1 className="max-w-8xl text-center text-4xl font-bold">
        {review.comment}
      </h1>
      <div className="text-justify">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} />
        {markdown.description}
      </div>

      {/*JSON.stringify(review, null, 2)*/}
    </div>
  );
}
