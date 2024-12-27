import type { FC } from "preact/compat"

const Footer: FC = () => {
  return (
    <footer className="w-full p-4 text-center">
      Built by&nbsp;
      <a href="https://huey.xyz">Huey</a>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      <a href="https://github.com/hueyy/iNatViewer">View source code</a>
    </footer>
  )
}

export default Footer
