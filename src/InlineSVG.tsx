import * as React from 'react'

type InlineSVGProps = {
  src: string
  className?: string
}

export type InlineSVGComponent = React.FC<InlineSVGProps>

export const InlineSVG: InlineSVGComponent = ({ src, className }) => {
  const [inline, setInline] = React.useState(null as any)
  const [loaded, setLoaded] = React.useState(false)

  async function convertSVG(url: string): Promise<string> {
    // Fetch the SVG file from the provided URL
    const response = await fetch(url)
    const svgString = await response.text()

    // Replace the "src" attribute with "data:image" to make it inline
    const inlineSVG = svgString.replace(
      /\bsrc\s*=\s*"([^"]+)"/gi,
      'src="data:image"'
    )

    return inlineSVG
  }

  React.useEffect(() => {
    const getImage = async (src: string) => {
      const inlineSVG = await convertSVG(
        src.replace(
          'https://a.storyblok.com',
          'https://s3.amazonaws.com/a.storyblok.com'
        )
      )
      setInline(inlineSVG)
      setLoaded(true)
    }

    void getImage(src)
  }, [src])

  return (
    <div className={className}>
      {loaded ? (
        <div dangerouslySetInnerHTML={{ __html: inline }} />
      ) : (
        <div>Loading SVG...</div>
      )}
    </div>
  )
}
