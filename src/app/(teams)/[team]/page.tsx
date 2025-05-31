interface Params {
  team: string;
}

interface Props {
  params: Promise<Params>;
}

export default async function Team(props: Props) {
  const params = await props.params;

  return <main>Team: {JSON.stringify(params)}</main>;
}
