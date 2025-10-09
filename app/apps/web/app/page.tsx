// import Image, { type ImageProps } from "next/image";
// import {
//   ButtonGroup,
//   ButtonGroupSeparator,
//   ButtonGroupText,
// } from "@/components/ui/button-group";
// type Props = Omit<ImageProps, "src"> & {
//   srcLight: string;
//   srcDark: string;
// };

// const ThemeImage = (props: Props) => {
//   const { srcLight, srcDark, ...rest } = props;

//   return (
//     <>
//       <Image {...rest} src={srcLight} className="imgLight" />
//       <Image {...rest} src={srcDark} className="imgDark" />
//     </>
//   );
// };

// export default function Home() {
//   return (
//     <ButtonGroup>
//       <ButtonGroupText>Text</ButtonGroupText>
//     </ButtonGroup>
//   );
// }

"use client";
import { Hero } from "@/components/home/Hero";
import { useAuth } from "../src/hooks/useAuth";
import { redirect } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  if (user) {
    redirect("/dashboard");
  }
  return (
    <div>
      <Hero />
    </div>
  );
}
