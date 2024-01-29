import { Card, CardBody } from "@nextui-org/card";
import { User } from "@nextui-org/user";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function UserCard({
  user,
  router,
}: {
  user: Record<string, any>;
  router: AppRouterInstance;
}) {
  return (
    <Card
      isPressable
      onPress={() => router.push(`/user/${user.username}`)}
      shadow="sm"
    >
      <CardBody>
        <User
          name={user.display_name}
          className="justify-start gap-4"
          description={
            <p className="text-sm text-primary">{"@" + user.username}</p>
          }
          avatarProps={{
            src: user.avatar_url,
            imgProps: { referrerPolicy: "no-referrer" },
          }}
        />
      </CardBody>
    </Card>
  );
}
