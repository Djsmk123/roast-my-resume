import RoastResponse from '@/model/roast_model';

function shareUrl(obj: RoastResponse): string {
    "share current url with /roast?id"
    const url = new URL(window.location.href);
    url.pathname = '/roast';
    url.searchParams.set('id', obj.id);
    return url.toString();

}


export { shareUrl, };
