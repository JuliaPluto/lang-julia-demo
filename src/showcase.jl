#=
  showcase.jl — a tour of modern Julia, packed with colorful syntax.
  Block comments use the #= ... =# delimiters.
  
  This code is AI generated, it has no purpose other than to showcase syntax highlighting.
=#

module Showcase

using LinearAlgebra
using Statistics: mean, std
import Base: +, show

export Particle, simulate, ∇energy
public kinetic

const PLANCK = 6.62607015e-34   # a const with a float literal
const φ = (1 + √5) / 2          # golden ratio, unicode identifier

"""
    Particle{T<:Real}

A point mass living in `N`-dimensional space.
This is a docstring — note the triple-quoted string.
"""
struct Particle{T<:Real}
    position::Vector{T}
    velocity::Vector{T}
    mass::T
end

# Abstract types and a subtype relationship
abstract type Shape end

public Circle
mutable struct Circle <: Shape
    radius::Float64
end

# Multiple dispatch: same name, different signatures
area(c::Circle)         = π * c.radius^2
area(s::Shape)          = error("not implemented for $(typeof(s))")

# Short-circuit, ternary, comparison chaining
classify(x) = x < 0 ? :negative : x == 0 ? :zero : :positive
inrange(x)  = 0 ≤ x ≤ 100 && isodd(round(Int, x))

@inline function kinetic(p::Particle)
    return 0.5 * p.mass * sum(abs2, p.velocity)
end

# Keyword arguments, default values, varargs
function simulate(particles::Vector{<:Particle}; steps::Int = 1_000, dt = 0.01, kwargs...)
    energies = Float64[]
    for step in 1:steps
        total = mapreduce(kinetic, +, particles; init = 0.0)
        push!(energies, total)
        @info "step $step" total maxlog=5
    end
    return energies
end

# Broadcasting, comprehensions, ranges
grid      = [x^2 + y^2 for x in -2:0.5:2, y in -2:0.5:2]
scaled    = grid .|> sqrt .+ 1.0
evens     = filter(iseven, 1:20)
pairs_map = Dict(:a => 1, :b => 2, :c => 3)

# String flavors: interpolation, raw, regex, char, bytes
name      = "Ada"
greeting  = "Hello, $(uppercase(name))! You have $(length(name)) letters."
path      = raw"C:\Users\julia\file.jl"
pattern   = r"^\d{3}-\d{4}$"i
letter    = 'λ'
bytes     = b"\xDE\xAD\xBE\xEF"

# Numbers in many bases and types
hex   = 0xff_ff
oct   = 0o755
bin   = 0b1010_1010
rat   = 3 // 4
cplx  = 2 + 3im
big   = 12345678901234567890

# do-block, anonymous functions, piping
result = map([1, 2, 3]) do n
    n^2 - 1
end
squared = (1:5) .|> x -> x^2

# Gradient via a unicode-named function
function ∇energy(p::Particle; α::Float64 = 1.0)
    return α .* p.position ./ norm(p.position)
end

# A macro definition and metaprogramming
macro sayhello(name)
    return :( println("Hello, ", $(esc(name))) )
end

@assert area(Circle(2.0)) ≈ 12.566370614359172

# Custom show method, operator overloading
Base.:+(a::Particle, b::Particle) = Particle(a.position .+ b.position,
                                              a.velocity .+ b.velocity,
                                              a.mass + b.mass)

show(io::IO, p::Particle) = print(io, "Particle@", p.position)

end # module Showcase
