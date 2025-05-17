export default function Circles() {
    return (
        <>
            <div className="absolute -top-10 -left-20 -translate-y-1/2 -translate-x-1/2 w-[60em] h-[60em] bg-muted rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute  -top-10 -left-20 -translate-y-1/2 -translate-x-1/2 w-[70em] h-[70em] bg-secondary/40 rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 translate-y-1/2 translate-x-1/2 w-[45em] h-[45em] bg-muted rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 translate-y-1/2 translate-x-1/2 w-[60em] h-[60em] bg-secondary/40 rounded-full opacity-10 animate-pulse"></div>
        </>
    )
}
