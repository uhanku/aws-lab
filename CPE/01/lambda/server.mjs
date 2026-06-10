import { EC2Client, RunInstancesCommand, DescribeInstancesCommand, TerminateInstancesCommand } from "@aws-sdk/client-ec2";

const ec2 = new EC2Client({});

const LAUNCH_TEMPLATE_ID = "lt-0636a55f5dfe4e485";
const INSTANCE_NAME = "t1-elb";

export const handler = async (event) => {
  const action = event.action;

  if (action === "start") {
    const response = await ec2.send(new RunInstancesCommand({
      LaunchTemplate: {
        LaunchTemplateId: LAUNCH_TEMPLATE_ID,
        Version: "$Latest"
      },
      MinCount: 1,
      MaxCount: 1
    }));

    return {
      action: "start",
      instance_id: response.Instances[0].InstanceId
    };
  }

  if (action === "terminate") {
    const response = await ec2.send(new DescribeInstancesCommand({
      Filters: [
        { Name: "tag:Name", Values: [INSTANCE_NAME] },
        { Name: "instance-state-name", Values: ["pending", "running", "stopping", "stopped"] }
      ]
    }));

    const instanceIds = response.Reservations.flatMap(reservation =>
      reservation.Instances.map(instance => instance.InstanceId)
    );

    if (instanceIds.length > 0) {
      await ec2.send(new TerminateInstancesCommand({
        InstanceIds: instanceIds
      }));
    }

    return {
      action: "terminate",
      terminated: instanceIds
    };
  }

  return { error: "Invalid action" };
};