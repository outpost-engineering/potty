interface Params {
  team: string;
}

interface Props {
  params: Promise<Params>;
}

export default async function Settings(props: Props) {
  const params = await props.params;

  return <main>Team Settings: {JSON.stringify(params)}</main>;
}
