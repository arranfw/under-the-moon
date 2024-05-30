import React from "react";

import { auth } from "@/auth";
import { Circle } from "@/components/circles/Circle";
import {
  addUserToCircle,
  getCircle,
  getCircles,
  getUserCircles,
  removeUserFromCircle,
} from "@/db/repositories/circles";

import { partition } from "lodash";
import { revalidatePath } from "next/cache";

interface PageProps {}

const Page: React.FC<PageProps> = async () => {
  const session = await auth();

  const circles = await getCircles();
  const currentUserCircles = session?.user?.id
    ? await getUserCircles(session?.user?.id)
    : [];

  const leaveCircle = async (formData: FormData) => {
    "use server";
    const circleId = formData.get("circleId");
    if (!session?.user?.id || typeof circleId !== "string") {
      return;
    }
    await removeUserFromCircle({
      circleId,
      userId: session?.user.id,
    });
    revalidatePath("/circles");
  };

  const joinCircle = async (prevState: any, formData: FormData) => {
    "use server";
    const circleId = formData.get("circleId");
    const password = formData.get("password");
    if (!session?.user?.id || typeof circleId !== "string") {
      return;
    }

    const circle = await getCircle(circleId);
    if (circle.password) {
      if (typeof password !== "string" || circle.password !== password) {
        return {
          message: "Invalid password",
        };
      }
    }

    await addUserToCircle({
      circleId,
      userId: session?.user.id,
    });
    revalidatePath("/circles");
  };

  const [globalCircles, userCircles] = partition(
    circles,
    (circle) => circle.isSystem,
  );

  if (!session) {
    return <h2>Please sign in to view Circles</h2>;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <h2 className="text-lg mb-2">Choose who to share with</h2>
      {globalCircles.map((circle) => (
        <Circle
          circle={circle}
          currentCircles={currentUserCircles}
          joinCircle={joinCircle}
          leaveCircle={leaveCircle}
        />
      ))}
      {userCircles.map((circle) => (
        <Circle
          key={circle.id}
          circle={circle}
          currentCircles={currentUserCircles}
          joinCircle={joinCircle}
          leaveCircle={leaveCircle}
          createdBy={{
            name: circle.createdByUserName,
            imageUrl: circle.createdByUserImage,
          }}
        />
      ))}
    </div>
  );
};

export default Page;
