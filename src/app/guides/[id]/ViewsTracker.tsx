"use client";

import supabase from "@/utils/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import React, { useEffect } from "react";

export default function ViewsTracker({ guideId }: { guideId: number }) {
  useEffect(() => {
    const incrementViews = async () => {
      console.log("incrementing views");
      const { error } = await supabase.rpc("increment_views", {
        p_guide_id: guideId,
      });
      if (error) console.log(error);
    };

    let fromSS = sessionStorage.getItem(`guideViewed${guideId}`);
    if (!fromSS) {
      sessionStorage.setItem(`guideViewed${guideId}`, "true");
      incrementViews();
    }
  }, [guideId]);

  return <></>;
}
