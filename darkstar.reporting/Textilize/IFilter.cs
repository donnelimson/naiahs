using Fluid;
using Fluid.Values;
using System.Threading.Tasks;

namespace darkstar.reporting
{
    public interface IFilter
    {
        string Name { get; }
    }

    public interface ISyncFilter : IFilter
    {
        FluidValue Execute(FluidValue input, FilterArguments arguments, Fluid.TemplateContext context);
    }

    public interface IAsyncFilter : IFilter
    {
        ValueTask<FluidValue> ExecuteAsync(FluidValue input, FilterArguments arguments, Fluid.TemplateContext context);
    }
}